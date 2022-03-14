import { useEffect, useState } from "react"


export const ProgressBar = ({ percentage }) => {

    const [finished, setFinished] = useState(false)

    useEffect(() => {
        if (percentage > 95) setFinished(true)
    }, [percentage])

    return (
        <div className="progress-bar">
            <div className="backgroud">
                <div className="progress" data-finished={finished} style={{ width: `${percentage}%` }}></div>
            </div>
        </div>
    )
}