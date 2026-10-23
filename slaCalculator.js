// slaCalculator.js

/**
 * Calculates Composite SLA for services chained in series (e.g., SLA_1 * SLA_2).
 * @param {number[]} slaPercentages - e.g. [99.9, 99.99]
 */
export function calculateCompositeSLA(slaPercentages) {
  const compositeDecimal = slaPercentages.reduce((acc, sla) => acc * (sla / 100), 1);
  const compositePercent = (compositeDecimal * 100).toFixed(4);

  // Annual downtime calculation (365 days * 24 hours * 60 mins = 525,600 minutes)
  const totalMinutesInYear = 525600;
  const downtimeMinutes = ((1 - compositeDecimal) * totalMinutesInYear).toFixed(2);

  let downtimeFormatted = `${downtimeMinutes} mins/year`;
  if (downtimeMinutes > 60) {
    downtimeFormatted = `${(downtimeMinutes / 60).toFixed(2)} hours/year`;
  }

  return {
    compositeSLA: parseFloat(compositePercent),
    downtimePerYear: downtimeFormatted
  };
}
