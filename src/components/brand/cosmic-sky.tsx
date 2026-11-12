/**
 * Backdrop behind the dashboard: a faint cyan glow in light mode, a violet/cyan/magenta
 * nebula with a star field (some twinkling) in dark mode — the web version of the app's
 * focus-mode background. Fixed and pointer-transparent; costs no JS.
 */
export function CosmicSky() {
  return (
    <div aria-hidden className='pointer-events-none fixed inset-0 -z-10'>
      <div className='cosmic-sky absolute inset-0' />
      <div className='cosmic-stars absolute inset-0 hidden opacity-80 dark:block' />
      <div className='cosmic-stars cosmic-stars-twinkle absolute inset-0 hidden dark:block' />
    </div>
  );
}
