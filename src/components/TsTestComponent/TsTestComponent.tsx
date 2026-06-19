interface Props {
  content?: string
}

const TsTestComponent = (props: Props): any => {
  return <>{props.content || 'TsTestComponent'}</>
}

// TsTestComponent({ content: 'test' })

export default TsTestComponent
