// Rule-based recommendation engine for the Eco Itinerary Planner.
// Pure JS: no Express/Mongoose imports, so every rule below can be
// required and unit-tested in isolation (see dissertation appendix).

const BUDGET_RANK = { low: 1, medium: 2, high: 3 };
const MAX_RAW_SCORE = 130; // 40(R1b) + 10(R2) + 25(R3) + 20(R4) + 15(R5) + 10(R7) + 10(R8)
const SCORE_THRESHOLDS = [30, 15, 0];
const MIN_RESULTS = 3;

// R1 — hard filter: destination must serve at least one selected interest
// (as its primary activity_type or one of its secondary_activities).
function passesInterestFilter(destination, interests) {
  if (!interests || interests.length === 0) return true;
  if (interests.includes(destination.activity_type)) return true;
  return destination.secondary_activities.some((a) => interests.includes(a));
}

// R1b — primary interest match.
function rulePrimaryInterest(destination, interests) {
  if (interests.length > 0 && interests.includes(destination.activity_type)) {
    return {
      points: 40,
      reason: `Matches your interest in ${destination.activity_type} (primary activity).`,
    };
  }
  return { points: 0, reason: null };
}

// R2 — secondary interest bonus (only when user picked 2+ interests).
function ruleSecondaryInterest(destination, interests) {
  if (interests.length < 2) return { points: 0, reason: null };
  const match = destination.secondary_activities.find(
    (a) => interests.includes(a) && a !== destination.activity_type
  );
  if (match) {
    return {
      points: 10,
      reason: `Also supports ${match} — bonus match for your multi-interest trip.`,
    };
  }
  return { points: 0, reason: null };
}

// R3 — budget tier closeness.
function ruleBudget(destination, budget) {
  const diff = Math.abs(BUDGET_RANK[destination.budget_tier] - BUDGET_RANK[budget]);
  if (diff === 0) {
    return {
      points: 25,
      reason: `Your budget (${budget}) matches this destination's tier exactly.`,
    };
  }
  if (diff === 1) {
    return {
      points: 10,
      reason: `This destination is one tier away from your budget — still reasonably close.`,
    };
  }
  return { points: 0, reason: null };
}

// R4 — duration adequacy vs. min_recommended_days.
function ruleDuration(destination, duration) {
  const min = destination.min_recommended_days;
  if (duration >= min) {
    return {
      points: 20,
      reason: `Recommended minimum stay is ${min} day(s); your planned ${duration} day(s) is comfortable.`,
    };
  }
  if (duration === min - 1) {
    return {
      points: 5,
      reason: `Recommended minimum stay is ${min} day(s); your planned ${duration} day(s) is a little tight.`,
    };
  }
  return {
    points: -15,
    reason: `Recommended minimum stay is ${min} day(s); your planned ${duration} day(s) may feel rushed.`,
  };
}

// R5 — season match.
function ruleSeason(destination, travelSeason) {
  if (!travelSeason || travelSeason === "no_preference") {
    return { points: 0, reason: null, mismatched: false };
  }
  if (destination.best_season === travelSeason || destination.best_season === "Year-round") {
    return {
      points: 15,
      reason: `Selected travel period (${travelSeason}) matches this destination's best season.`,
      mismatched: false,
    };
  }
  return {
    points: -10,
    reason: `${travelSeason} is outside this destination's recommended ${destination.best_season} window — expect less favorable conditions.`,
    mismatched: true,
  };
}

// R6 — coastal monsoon safety rule (beach-specific, stacks on R5 mismatch).
function ruleCoastalSafety(destination, seasonResult) {
  if (destination.activity_type === "beach" && seasonResult.mismatched) {
    return {
      points: -10,
      reason: "Rough seas are typical on this coast during your selected season — swimming/snorkeling is not advisable.",
    };
  }
  return { points: 0, reason: null };
}

// R7 — sensitivity-aware sustainability rule.
function ruleSensitivity(destination, duration) {
  if (destination.environmental_sensitivity !== "high") return { points: 0, reason: null };
  if (duration < destination.min_recommended_days) {
    return {
      points: -10,
      reason: "High-sensitivity ecosystem — a rushed visit is discouraged for conservation reasons.",
    };
  }
  return {
    points: 10,
    reason: "You're planning an adequately-paced, lower-impact visit to a sensitive ecosystem.",
  };
}

// R8 — short-trip culture bonus.
function ruleShortTripCulture(destination, duration) {
  if (duration <= 2 && destination.activity_type === "culture") {
    return {
      points: 10,
      reason: "Cultural/heritage sites suit short visits well, unlike multi-day wildlife or hiking treks.",
    };
  }
  return { points: 0, reason: null };
}

// Applies R1b-R8 to a single destination, returns raw score + reasons.
function scoreDestination(destination, userInput) {
  const { budget, duration, interests, travelSeason } = userInput;

  const seasonResult = ruleSeason(destination, travelSeason);
  const parts = [
    rulePrimaryInterest(destination, interests),
    ruleSecondaryInterest(destination, interests),
    ruleBudget(destination, budget),
    ruleDuration(destination, duration),
    seasonResult,
    ruleCoastalSafety(destination, seasonResult),
    ruleSensitivity(destination, duration),
    ruleShortTripCulture(destination, duration),
  ];

  const raw = parts.reduce((sum, p) => sum + p.points, 0);
  const clamped = Math.max(0, Math.min(MAX_RAW_SCORE, raw));
  const score = Math.round((clamped / MAX_RAW_SCORE) * 100);
  const reasons = parts.map((p) => p.reason).filter(Boolean);

  return { score, reasons };
}

// R9/R10 — score, filter by threshold (relaxed progressively), sort descending.
function rankDestinations(destinations, userInput) {
  const eligible = destinations.filter((d) => passesInterestFilter(d, userInput.interests));

  const scored = eligible
    .map((d) => {
      const { score, reasons } = scoreDestination(d, userInput);
      return { ...d, score, reasons };
    })
    .sort((a, b) => b.score - a.score);

  for (const threshold of SCORE_THRESHOLDS) {
    const filtered = scored.filter((d) => d.score >= threshold);
    if (filtered.length >= MIN_RESULTS || filtered.length === scored.length) {
      return filtered;
    }
  }
  return scored;
}

// R11 — itinerary assembly heuristic: walk the ranked list top to bottom,
// allocating each stop min(min_recommended_days, daysRemaining).
function buildItinerary(rankedDestinations, totalDays) {
  const itinerary = [];
  let dayCursor = 1;
  let daysRemaining = totalDays;
  let lastStop = null;
  let visitOrder = 1;

  for (const destination of rankedDestinations) {
    if (daysRemaining <= 0) break;
    const allocated = Math.min(destination.min_recommended_days, daysRemaining);
    const startDay = dayCursor;
    const endDay = dayCursor + allocated - 1;

    itinerary.push({
      day_range: startDay === endDay ? `Day ${startDay}` : `Day ${startDay}-${endDay}`,
      destination_id: destination.id,
      title: destination.title,
      activity_focus: destination.activity_type,
      notes: destination.conservation_notes,
      visit_order: visitOrder,
      recommended_stay_days: destination.min_recommended_days,
      coordinates: destination.coordinates,
      estimated_cost_lkr: destination.estimated_cost_lkr,
    });

    visitOrder += 1;
    dayCursor = endDay + 1;
    daysRemaining -= allocated;
    lastStop = itinerary[itinerary.length - 1];
  }

  // If days remain after exhausting the ranked list, extend the last stop
  // rather than repeating a destination.
  if (daysRemaining > 0 && lastStop) {
    const [, startDay] = lastStop.day_range.match(/Day (\d+)/);
    const newEndDay = dayCursor + daysRemaining - 1;
    lastStop.day_range = `Day ${startDay}-${newEndDay}`;
    daysRemaining = 0;
  }

  return itinerary;
}

module.exports = {
  scoreDestination,
  rankDestinations,
  buildItinerary,
  passesInterestFilter,
  rulePrimaryInterest,
  ruleSecondaryInterest,
  ruleBudget,
  ruleDuration,
  ruleSeason,
  ruleCoastalSafety,
  ruleSensitivity,
  ruleShortTripCulture,
};
