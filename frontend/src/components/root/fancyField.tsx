import { Dispatch, SetStateAction } from "react"

type FieldProps = {
    placeholder: string
    value: string
    setValue: Dispatch<SetStateAction<string>>
    type?: string
    bg?: string
}

export default function FancyField({placeholder, value, setValue, type, bg}: FieldProps) {
    const date = type === "date" ? new Date(value) : new Date()
    const content = type === "date" 
        ? `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`
        : value

    function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
        const input = event.target.value
        if (type === "date") {
            const date = new Date()
            date.setFullYear(Number(input.slice(0, 4)))
            date.setMonth(Number(input.slice(5, 7)) + 1)
            date.setDate(Number(input.slice(8, 10)))
            setValue(date.toISOString())
        } else {
            setValue(input)
        }
    }

    return (
        <div className="w-full rounded-md py-1 outline outline-1 outline-almostbright relative mt-1">
            <h1 className={`absolute -top-1 ml-2 text-sm ${bg ? `${bg}` : 'bg-normal'} z-9 h-3 text-transparent px-1`}>{placeholder}</h1>
            <h1 className="absolute -top-[0.7rem] ml-2 text-sm px-1 z-10">{placeholder}</h1>
            <input 
                type={type || "text"}
                value={content} 
                onChange={handleChange}
                className="w-full rounded-lg text-almostbright px-2 focus:outline-none bg-transparent" 
            />
        </div>
    )
}
