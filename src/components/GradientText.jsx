import C from '../theme/colors'

export default function GradientText({ children, gradient, style, as: Tag = 'span' }) {
  return (
    <Tag style={{
      background: gradient || C.gradientBlue,
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      ...style,
    }}>
      {children}
    </Tag>
  )
}
