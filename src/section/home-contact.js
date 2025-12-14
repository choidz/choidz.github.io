import React from "react";
import { CONTACT_INFO } from "../data/portfolio";

export default function HomeContact() {
  const { email, message, location, socials } = CONTACT_INFO;

  return (
    <section className="my-24 rounded-[32px] bg-slate-900 p-10 text-white">
      <div className="grid gap-8 md:grid-cols-[1.2fr,0.8fr]">
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-emerald-300">
            Let's collaborate
          </p>
          <h2 className="mt-3 text-3xl font-bold">
            새로운 파트너십과 제품 기회를 기다립니다.
          </h2>
          <p className="mt-4 text-base text-slate-200">{message}</p>
          <div className="mt-8 space-y-3 text-sm text-slate-200">
            <p>
              <span className="font-semibold text-white">Email.</span> {email}
            </p>
            <p>
              <span className="font-semibold text-white">Location.</span> {location}
            </p>
          </div>
        </div>
        <div className="rounded-3xl bg-white/10 p-6 backdrop-blur">
          <p className="text-sm font-semibold uppercase tracking-widest text-emerald-200">
            Connect
          </p>
          <ul className="mt-4 space-y-3">
            {socials.map((social) => (
              <li key={social.label}>
                <a
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between rounded-2xl border border-white/10 px-4 py-3 text-base font-medium text-white transition hover:border-emerald-300 hover:text-emerald-200"
                >
                  {social.label}
                  <span aria-hidden>↗</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
