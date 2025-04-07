import { formatDate, getProjectDates, calculateTimeline } from "@/utils/projectUtils";
import {
    Calendar,
    Clock,
    Hourglass,
    CalendarIcon,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function KeyDatesCard({ project }) {
    const dates = getProjectDates(project);

    return (
        <div>
            <Card className="shadow-sm bg-primary-bg w-[500px] ml-12 mt-10 p-4">
                <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                        <CalendarIcon className="w-4 h-4" />
                        Fechas Clave
                    </CardTitle>
                </CardHeader>
                <CardContent className='bg-primary-bg'>
                    <div className="flex flex-col space-y-3">
                        {dates.map((date, i) => {
                            if (!date) return null;

                            const label = i === 0 ? "Inicio" : i === 1 ? "Próxima revisión" : "Fin";

                            return (
                                <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-primary-bg ">
                                    <div className="bg-primary-bg/10 rounded-full p-2">
                                        {date.icon === "calendar" && <Calendar className="w-4 h-4 text-primary-text" />}
                                        {date.icon === "clock" && <Clock className="w-4 h-4 text-primary" />}
                                        {date.icon === "hourglass" && <Hourglass className="w-4 h-4 text-primary-text" />}
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
                                        <p className="text-sm font-medium">{formatDate(date.date)}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                </CardContent>
            </Card>
        </div>
    )
}