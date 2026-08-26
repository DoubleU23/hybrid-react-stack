import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import React, { ChangeEvent } from 'react';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

interface InputFileUploadProps {
  fieldName: string; //  Geändert von "name" zu "fieldName", um Namenskonflikte mit window.name zu vermeiden
  label?: string;
  icon?: React.ReactElement;
  onFieldChange: (name: string, value: File | File[] | null) => void;
  multiple?: boolean;
}

const defaultProps = {
  label: 'Upload File',
  icon: <CloudUploadIcon />,
  multiple: false
};

export default function InputFileUpload({
  fieldName, //  Sauber destrukturiert
  label = defaultProps.label,
  icon = defaultProps.icon,
  onFieldChange,
  multiple = defaultProps.multiple,
}: InputFileUploadProps) {

  const handleNativeChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      onFieldChange(fieldName, null); //  Nutzt die eindeutige Variable aus den Props
      return;
    }

    if (multiple) {
      const fileList = Array.from(e.target.files);
      onFieldChange(fieldName, fileList);
    } else {
      onFieldChange(fieldName, e.target.files[0]); //  Nimmt die erste Datei bei Single-Upload
    }
  };
  
  return (
    <Button
      component="label"
      role={undefined}
      variant="contained"
      tabIndex={-1}
      startIcon={icon}
      fullWidth
    >
      {label}
      <VisuallyHiddenInput
        type="file"
        name={fieldName} //  Übergibt jetzt den sauberen String aus den Props anstatt der Funktion!
        onChange={handleNativeChange}
        multiple={multiple}
      />
    </Button>
  );
}