/**
 * Whether the visitor has pressed MASTER WARN on the current error page.
 * Shared by the light on the glareshield (CockpitShell.svelte) and the ECAM
 * text on the error page, which tells them to press it. The shell resets it
 * on every navigation.
 */
export const masterWarning = $state({ acknowledged: false });
