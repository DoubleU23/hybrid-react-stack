import Box from '@mui/material/Box'
import Slider from '@mui/material/Slider'
import { styled } from '@mui/material/styles'
import * as React from 'react'

const ImageBox = ({ src, height, width, ...props }: any) => {
  console.log('ImageBoxRender :>> ', true)
  return (
    <div
      style={{
        position: 'relative',
        width: width,
        height: height,
      }}
    >
      <Box
        {...props}
        sx={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
          backgroundSize: 'cover',
          backgroundPosition: 'center center',
          backgroundImage: `url(${src})`,
        }}
      />
    </div>
  )
}
export default ImageBox
