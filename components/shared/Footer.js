import Link from "next/link"

export function Footer() {
  return (
    <footer className="bg-[#171717]" style={{ borderTop: "1px solid #242424" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-[96px]">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About Column */}
          <div>
            <h3 className="text-[14px] font-medium mb-4 text-[#fafafa]" style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif" }}>
              About
            </h3>
            <p className="text-[14px] leading-[1.43] text-[#898989]" style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif" }}>
              NomadBase Goa connects digital nomads with the best coliving spaces, work-friendly cafes, and community events in Goa.
            </p>
          </div>

          {/* Tracks Column */}
          <div>
            <h3 className="text-[14px] font-medium mb-4 text-[#fafafa]" style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif" }}>
              Tracks
            </h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  href="/spaces" 
                  className="text-[14px] transition-colors text-[#00c573]"
                  style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif" }}
                >
                  Spaces
                </Link>
              </li>
              <li>
                <Link 
                  href="/colivings" 
                  className="text-[14px] transition-colors text-[#00c573]"
                  style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif" }}
                >
                  Colivings
                </Link>
              </li>
              <li>
                <Link 
                  href="/community" 
                  className="text-[14px] transition-colors text-[#00c573]"
                  style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif" }}
                >
                  Community
                </Link>
              </li>
            </ul>
          </div>

          {/* Built For Column */}
          <div>
            <h3 className="text-[14px] font-medium mb-4 text-[#fafafa]" style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif" }}>
              Built For
            </h3>
            <ul className="space-y-2">
              <li>
                <a 
                  href="https://devfolio.co" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-[14px] transition-colors text-[#00c573]"
                  style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif" }}
                >
                  Susegad Sprint 2026
                </a>
              </li>
              <li>
                <a 
                  href="https://devfolio.co" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-[14px] transition-colors text-[#00c573]"
                  style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif" }}
                >
                  Devfolio
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-[#242424]">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-[12px] text-[#898989]" style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif" }}>
              Made with ♥ in Goa
            </p>
            <p className="text-[12px] text-[#898989]" style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif" }}>
              © {new Date().getFullYear()} NomadBase Goa. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
