import Services from "./root/services"

export default function Menu() {
    return (
        <div className="hidden menu absolute grid grid-rows-9 left-0 top-0 h-full w-full bg-normal">
            <div />
            <div className="row-span-8">
                <Services />
            </div>
        </div>
    )
}
