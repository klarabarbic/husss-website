import Image from "next/image";
import { DONATE, venmoUrl } from "@/content/donate";
import { IconExternal } from "./icons";

export default function Donate() {
  const url = venmoUrl(DONATE.handle);
  return (
    <div className={`panel donate${DONATE.qr ? "" : " no-qr"}`} id="donate" data-rise="">
      {DONATE.qr && (
        <figure className="donate__qr">
          <Image
            src={DONATE.qr}
            alt={`Venmo QR code for @${DONATE.handle}, the Harvard Undergraduate South Slavic Society`}
            width={224}
            height={224}
            unoptimized
          />
          <figcaption>Scan with your phone camera</figcaption>
        </figure>
      )}

      <div className="donate__body">
        <h3>
          Support HUSSS <span className="tag">Venmo</span>
        </h3>
        <p>
          Every dollar goes straight into the events on this site: the food, the spaces and the evenings that keep
          this community together. Donations of any size are genuinely welcome, and there is no minimum worth
          apologizing for.
        </p>

        <p className="donate__cta">
          <a className="btn" href={url} target="_blank" rel="noopener noreferrer">
            <IconExternal />
            <span>Donate with Venmo</span>
          </a>
        </p>

        {/* typing the handle matters: anyone reading this on their phone
            cannot scan a code that is on that same phone's screen */}
        <p className="donate__alt">
          Or search for <strong>@{DONATE.handle}</strong> in the Venmo app.
        </p>
        <p className="donate__warn">
          Venmo payments are instant and usually cannot be reversed. Please check that the profile shows
          @{DONATE.handle} before you send, and email either co-president if anything looks wrong.
        </p>
      </div>
    </div>
  );
}
