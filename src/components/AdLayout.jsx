import Section from './Section'
import AdBanner from './AdBanner'
import { AD_SLOTS } from '../config/ads'

export default function AdLayout({ children }) {
  return (
    <>
      {children}
      <Section style={{ paddingTop: 24, paddingBottom: 24 }}>
        <AdBanner slot={AD_SLOTS.PAGE_BOTTOM} format="horizontal" />
      </Section>
    </>
  )
}
