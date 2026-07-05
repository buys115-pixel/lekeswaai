/**
 * Fault + drill library
 * -----------------------------------------------------------------------
 * Each entry describes a swing fault the analyser can detect, in plain
 * language, plus drills to fix it. `tier: 'free'` faults show full detail
 * to everyone; `tier: 'premium'` faults show a locked teaser until the
 * user upgrades.
 *
 * `videoQuery` is used to build a YouTube *search* link rather than a
 * hardcoded video URL — that way you're never pointing users at a stale
 * or wrong link, and you can swap in curated links later once you've
 * picked real instructors (see README for how to do that).
 */

export const FAULTS = [
  {
    id: 'over-the-top',
    tier: 'free',
    name: 'Over-the-top move',
    plainEnglish: "Your club comes down outside the ideal path and cuts across the ball — the classic cause of a slice or a weak pull.",
    detectedFrom: 'Shoulder and hand path during the transition from backswing to downswing.',
    drills: [
      {
        title: 'Headcover gate drill',
        steps: [
          'Place a headcover or towel just outside your ball, on the target line.',
          'Take slow half-swings, focused only on missing the headcover on the way down.',
          'Build back up to full speed once you can miss it 10 times in a row.',
        ],
      },
      {
        title: 'Pump drill from the top',
        steps: [
          'Swing to the top and pause.',
          'Drop your hands straight down toward your back hip pocket ("pump") before turning through.',
          'Repeat the pump 3 times, then let the 4th one go into a full swing.',
        ],
      },
    ],
    videoQuery: 'fix over the top golf swing drill',
  },
  {
    id: 'early-extension',
    tier: 'free',
    name: 'Early extension',
    plainEnglish: "Your hips and spine straighten up and move toward the ball too early in the downswing, which steals room for your arms and often causes thin or shanked shots.",
    detectedFrom: 'Hip-to-camera distance and spine angle from address through impact.',
    drills: [
      {
        title: 'Chair drill',
        steps: [
          'Set up with a chair (or golf bag) just behind your trailing hip.',
          'Make slow swings, keeping light contact with the chair through impact.',
          'If your hips lose contact early, that is the early extension move — slow down and repeat.',
        ],
      },
      {
        title: 'Wall drill',
        steps: [
          'Stand with your backside lightly touching a wall at address.',
          'Swing back and through while trying to keep contact with the wall as long as possible.',
        ],
      },
    ],
    videoQuery: 'early extension golf drill fix',
  },
  {
    id: 'chicken-wing',
    tier: 'premium',
    name: 'Chicken wing (lead arm breakdown)',
    plainEnglish: "Your lead elbow bends and pulls away from your body through impact instead of staying extended, which costs distance and control.",
    detectedFrom: 'Lead elbow angle from impact through the early follow-through.',
    drills: [
      {
        title: 'Glove-under-arm drill',
        steps: [
          'Tuck a glove or headcover under your lead armpit.',
          'Make half-swings to impact without dropping it.',
        ],
      },
      {
        title: 'Towel extension drill',
        steps: [
          'Hold a towel or alignment stick along your lead arm and club shaft.',
          'Swing to impact focusing on keeping the stick in one straight line through the ball.',
        ],
      },
    ],
    videoQuery: 'fix chicken wing golf swing drill',
  },
  {
    id: 'reverse-spine',
    tier: 'premium',
    name: 'Reverse spine angle',
    plainEnglish: "Your upper body leans toward the target at the top of the backswing instead of tilting away from it, which makes a consistent, powerful downswing much harder.",
    detectedFrom: 'Spine tilt angle relative to the ground at the top of the backswing.',
    drills: [
      {
        title: 'Alignment stick spine drill',
        steps: [
          'Place an alignment stick along your spine at address, angled away from the target.',
          'Make backswings keeping your upper body tilted behind the stick, not over it.',
        ],
      },
    ],
    videoQuery: 'reverse spine angle golf drill',
  },
  {
    id: 'sway',
    tier: 'premium',
    name: 'Lateral sway',
    plainEnglish: "Your lower body slides sideways in the backswing instead of turning, which makes it hard to return the club consistently to the ball.",
    detectedFrom: 'Lead hip horizontal position from address to the top of the backswing.',
    drills: [
      {
        title: 'Foot-against-bag drill',
        steps: [
          'Set your golf bag or a chair just outside your trailing foot.',
          'Make backswings without bumping into it — this keeps the turn centred instead of sliding.',
        ],
      },
    ],
    videoQuery: 'fix sway golf backswing drill',
  },
  {
    id: 'flat-shoulder-turn',
    tier: 'premium',
    name: 'Flat shoulder turn',
    plainEnglish: "Your shoulders turn more around a horizontal plane than tilted with your spine, which often leads to shots that are struck fat or thin.",
    detectedFrom: 'Shoulder line tilt at the top of the backswing.',
    drills: [
      {
        title: 'Cross-club shoulder drill',
        steps: [
          'Hold a club across your shoulders at address, matching your spine tilt.',
          'Rotate to the top keeping the club angled the same way, not flat to the ground.',
        ],
      },
    ],
    videoQuery: 'steepen shoulder turn golf drill',
  },
]

export function getFaultById(id) {
  return FAULTS.find((f) => f.id === id)
}

export function youtubeSearchUrl(query) {
  return `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`
}
