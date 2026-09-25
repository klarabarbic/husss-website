/* ============================================================================
   VENMO DONATIONS

   handle  The Venmo username, without the @. The button, the QR code and the
           "search for" line all use it.
   qr      The QR image, saved in public/. "" hides the QR frame and leaves
           the button. public/venmo-qr.svg encodes https://venmo.com/u/husouthslavs,
           which opens the profile in the Venmo app. If the handle ever
           changes, the QR must be regenerated to match, or the button and the
           code will point to different accounts.
   ========================================================================= */

export const DONATE = {
  handle: "husouthslavs",
  qr: "/venmo-qr.svg",
};

export const venmoUrl = (handle: string) => `https://venmo.com/u/${handle}`;
