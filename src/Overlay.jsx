// import { Footer } from '@pmndrs/branding'
import React from 'react';

export default function Overlay() {
  return (
    <>
    None
      <Footer
        date="01. August"
        year="2023"
        link1={<a href="https://github.com/Shivamkak19">GitHub</a>}
        link2={<a href="https://linkedin.com/in/shivamkak">LinkedIn</a>}
      />
    </>
  )
}


// Directly from PMNDRS/DREI/BRANDING, refactor tsx to jsx, used as template!
export function Footer({ date, year, link1, link2 }) {
  return (
    <div className="pmndrs-menu">
      <div>
        <img src = "/skstudio-footerLogo.png" className='footerLogo' alt="skstudio-logo"></img>
      </div>
      <div>
        <span>
          <b>Shivam Kak</b>
        </span>
        <a href="https://pmnd.rs">Built with pmndrs drei for R3F</a>
      </div>
      <div>
        <span>{date}</span>
        <span>{year}</span>
      </div>
      <div>
        <span>        
          <a href="mailto:sk3686@princeton.edu?subject=Inquiries">Contact</a>
        </span>
        <span>        
          {/* <a href="https://www.etsy.com/listing/1527344405/custom-shirt-for-shivam-unisex-heavy">Merchandise</a> */}
        </span>
      </div>
      <div style={{ width: '100%' }} />

        <a href="https://github.com/shivamkak19">
          <img src="/github.png" className="socialLogo" alt="Github Logo"></img>
        </a>
        <a href="https://linkedin.com/in/shivamkak">
          <img src="/linkedin.png" className="socialLogo" alt="Linkedin Logo"></img>
        </a>

      <div>
        <b>{link1}</b>
        {link2}
      </div>
    </div>
  );
}