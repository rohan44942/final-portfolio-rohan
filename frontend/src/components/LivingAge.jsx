import { useEffect, useMemo, useState } from "react";

/** Birth date: 07/11/2002 (DD/MM/YYYY) → 7 November 2002 */
export const BIRTH_DATE = new Date(2002, 10, 7, 0, 0, 0, 0);
/** Mean Gregorian year length for a smoothly increasing age decimal. */
const MS_PER_YEAR = 365.2425 * 24 * 60 * 60 * 1000;

export function getAgeInYears(now = new Date(), birthDate = BIRTH_DATE) {
  let age = now.getFullYear() - birthDate.getFullYear();
  const monthDiff = now.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < birthDate.getDate())) {
    age -= 1;
  }
  return age;
}

export function getPreciseAgeYears(now = new Date(), birthDate = BIRTH_DATE) {
  return Math.max(0, (now.getTime() - birthDate.getTime()) / MS_PER_YEAR);
}

function LivingAge({ locationLabel = "Gurgaon" }) {
  const [now, setNow] = useState(() => new Date());
  const [hovering, setHovering] = useState(false);

  useEffect(() => {
    if (!hovering) return undefined;
    let frameId = 0;
    const tick = () => {
      setNow(new Date());
      frameId = requestAnimationFrame(tick);
    };
    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [hovering]);

  const ageYears = useMemo(() => getAgeInYears(now), [now]);
  const preciseAge = useMemo(() => getPreciseAgeYears(now).toFixed(10), [now]);

  return (
    <span className="living-age">
      <span
        className={`living-age-hotspot${hovering ? " is-hovering" : ""}`}
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
        onFocus={() => setHovering(true)}
        onBlur={() => setHovering(false)}
        tabIndex={0}
        aria-label={`${ageYears} years. Hover to see precise age.`}
      >
        <span className="living-age-number">{ageYears}</span>
        {" "}
        <span className="living-age-years">years</span>
        <span className="living-age-tip" role="status" aria-live="off">
          {preciseAge}
        </span>
      </span>
      <span className="living-age-rest"> old, based in {locationLabel}</span>
    </span>
  );
}

export default LivingAge;
