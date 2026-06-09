import React, { PureComponent } from 'react'

interface Props {
  content: string
}
const JsTestComponent = (props) => {
  return (<div>{props.content ?? 'JSTESTCOMPONENT'}</div>)
}

export default JsTestComponent

