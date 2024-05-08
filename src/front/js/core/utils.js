
export const CHARSETS= Object.freeze({
    ALPHA: "abcdefghijklmnopqrstuvwxyz",
    NAMES: "aeiouabcdefghijklmnopqrstuvwxyzaeiouaeiou012345678aeiou___",
    NICK: "aeiouaeiouabcdefghijklmnopqrstuvwxyzaeiouaeiou",
    ALPHANUM: "abcdefghijklmnopqrstuvwxyz0123456789",
    EMAIL: "aeiouabcdefghijklmnopqrstuvwxyzaeiouaeiou012345678aeiou___",
    NUM: "0123456789"
})

const _utils= ()=>{
    return {
        randomStr: (min, max=null, charset=CHARSETS.ALPHANUM)=>{
            if(!max) max= min
            const
                size= (min + Math.random()*(max-min)) >>> 0,
                charsetLen= charset.length-1,
                strBuilder= []
            for(let i=0; i< size; i++) strBuilder.push(charset[ (Math.random()*charsetLen) >>> 0])
            return strBuilder.join('')
        },

        randomUsername: (min, max=null, charset=CHARSETS.NAMES)=>{
            if(!max) max= min
            const
                size= (min + Math.random()*(max-min)) >>> 0,
                charsetLen= charset.length-1,
                strBuilder= []
            for(let i=0; i< size; i++) strBuilder.push(charset[ (Math.random()*charsetLen) >>> 0])
            return strBuilder.join('')
        },
    
        randomNick: (min, max=null, charset=CHARSETS.NICK)=>{
            if(!max) max= min
            const
                size= (min + Math.random()*(max-min)) >>> 0,
                charsetLen= charset.length-1,
                strBuilder= [],
                space= {
                    count: (Math.random()*(size*.33)+1) | 0,
                    min: (Math.random()*2+2) | 0,
                    max: (Math.random()*3+5) | 0,
                    last: 0
                }
    
            for(let i=0, j=0; i< size; i++) {
                const i_minus_last= i-space.last
                if(!j < space.count && ((Math.random() > .75 && i_minus_last >= space.min) || i_minus_last == space.max)) {
                    j++
                    space.last= i
                    strBuilder.push(' ')
                }
                else strBuilder.push(charset[ (Math.random()*charsetLen) | 0])
            }
            return strBuilder.join('')
        },
    
        randomEmail: (min, max=null, charset=CHARSETS.NAMES)=>{
            if(!max) max= min
            const
                size= (min + Math.random()*(max-min)) | 0,
                charsetLen= charset.length-1,
                strBuilder= [],
                underscore= {
                    count: Math.random()*2,
                    min: (Math.random()*2+2) | 0,
                    max: (Math.random()*3+5) | 0,
                    last: 0
                }
    
            for(let i=0, j=0; i< size; i++) {
                const i_minus_last= i-underscore.last
                if(j<underscore.count && ((Math.random() > .75 && i_minus_last > underscore.min) || i_minus_last == underscore.max)) {
                    j++
                    underscore.last= i
                    strBuilder.push('_')
                }
                else strBuilder.push(charset[ (Math.random()*charsetLen) | 0])
            }
    
            strBuilder.push("@example.com")
            return strBuilder.join('')
        },
    
        randomPin: (min, max=null)=>{
            if(!max) max= min
            const
                size= (min + Math.random()*(max-min)) | 0,
                charsetLen= CHARSETS.NUM.length-1,
                strBuilder= []
            for(let i=0; i< size; i++) strBuilder.push(CHARSETS.NUM[ (Math.random()*charsetLen) | 0])
            return strBuilder.join('')
        }
    }
}
const Utils= _utils()

export default Utils