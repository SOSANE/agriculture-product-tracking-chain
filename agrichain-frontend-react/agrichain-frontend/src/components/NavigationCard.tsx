import {ClipboardList, LucideIcon, UserCog} from "lucide-react";
import {Link} from "react-router-dom";

const NavigationCard = ({ buttons, isAdmin }: { buttons: {icon: LucideIcon, link: string, text: string, class: string}[], isAdmin: boolean }) => {
    return (
        <div className="card h-full">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Quick Actions</h2>
                {isAdmin && (<UserCog className="h-6 w-6 text-primary" />)}
                {!isAdmin && (<ClipboardList className="h-6 w-6 text-primary" />)}
            </div>
            <div className="space-y-4">
                {buttons.map((button) => {
                    const Icon = button.icon;
                    return (
                    <div key={button.link}>
                    <Link to={button.link} className={button.class}>
                        <Icon className="h-5 w-5 mr-2"/>
                        {button.text}
                    </Link>
                    </div>
                    );
            })}
            </div>
        </div>
    );
}

export default NavigationCard;