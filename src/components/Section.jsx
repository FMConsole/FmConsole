export default function Section({ children, style: sx, id }) {
  return (
    <section
      id={id}
      style={{
        maxWidth: 1200,
        margin: '0 auto',
        padding: '80px 24px',
        ...sx,
      }}
    >
      {children}
    </section>
  )
}
