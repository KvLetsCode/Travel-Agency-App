interface Props {
    title: string,
    description :string
}

import { cn } from "lib/utils"
import { useLocation } from "react-router"

const Header = ({ title, description }: Props) => {
    const location = useLocation();
    return (
      <header className="header">
          <article>
              <h1
                  className={cn(
                      "text-dark-100",
                      location.pathname === '/' ? 'text-2xl md:text-4xl' : 'text-xl md:text-2xl font-semibold'
                  )}
              >
                  {title}
              </h1>
              <p
                  className={cn(
                      "text-dark-100 font-normal",
                      location.pathname === '/' ? 'text-base md:text-lg' : 'text-sm md:text-lg '
                  )}
              >
                  {description}
              </p>
          </article>
      </header>
  )
}

export default Header