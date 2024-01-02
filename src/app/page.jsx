import Image from 'next/image'
import Uploader from "./uploader/page"
import WellcomePageComponent from "@/components/wellcome"

export default function Root() {
    return (
        <main className="flex min-h-screen flex-col">
            <WellcomePageComponent />
        </main>
    )
}
