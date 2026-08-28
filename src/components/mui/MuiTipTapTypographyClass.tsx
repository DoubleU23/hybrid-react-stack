import { Mark, mergeAttributes } from '@tiptap/core'

const MuiTypographyClass = Mark.create({
  name: 'muiTypographyClass',

  addOptions() {
    return { HTMLAttributes: {} }
  },

  addAttributes() {
    return {
      class: {
        default: null,
        parseHTML: element => element.getAttribute('class'),
        renderHTML: attributes => {
          if (!attributes.class) return {}
          return { class: attributes.class }
        },
      },
    }
  },

  parseHTML() {
    return [{ tag: 'span[class]' }]
  },

  renderHTML({ HTMLAttributes }) {
    return ['span', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0]
  },

  addCommands() {
    return {
      setMuiClass: (className: string) => ({ commands }) => {
        if (!className) return commands.unsetMark(this.name)
        return commands.setMark(this.name, { class: className })
      },
      unsetMuiClass: () => ({ commands }) => {
        return commands.unsetMark(this.name)
      },
    }
  },
})

// ADD THIS EXPLICIT TYPESCRIPT DECLARATION FOR TIPTAP
declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    muiTypographyClass: {
      /** Set a custom MUI Typography class on the selected text */
      setMuiClass: (className: string) => ReturnType
      /** Remove the MUI Typography class mark from the selected text */
      unsetMuiClass: () => ReturnType
    }
  }
}

export default MuiTypographyClass