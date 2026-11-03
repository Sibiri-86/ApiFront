import {
    AfterViewInit,
    Component,
    Inject,
    NgZone,
    OnDestroy,
    OnInit,
    PLATFORM_ID,
} from '@angular/core';
import { isPlatformBrowser, NgFor, NgIf, NgClass } from '@angular/common';
import { Subscription, debounceTime } from 'rxjs';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { TagModule } from 'primeng/tag';
import { ChartModule } from 'primeng/chart';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { CheckboxModule } from 'primeng/checkbox';
import { FormsModule } from '@angular/forms';
import { KnobModule } from 'primeng/knob';
import { RippleModule } from 'primeng/ripple';
import { ButtonModule } from 'primeng/button';

interface DailyTask {
    id: number;
    checked: boolean;
    label: string;
    description: string;
    avatar: string;
    borderColor: string;
}

@Component({
    templateUrl: './dashboardsaas.component.html',
    standalone: true,
    imports: [
        ButtonModule,
        RippleModule,
        KnobModule,
        FormsModule,
        NgFor,
        CheckboxModule,
        AvatarGroupModule,
        AvatarModule,
        ChartModule,
        NgIf,
        NgClass,
        TagModule,
    ],
})
export class DashboardSaasComponent implements OnInit, OnDestroy {
    subscription!: Subscription;

    constructor(
        @Inject(PLATFORM_ID) private platformId: Object,
        private zone: NgZone,
        private layoutService: LayoutService
    ) {
        this.subscription = this.layoutService.configUpdate$
            .pipe(debounceTime(25))
            .subscribe((config) => {
                this.initChart();
            });
    }

    ordersOptions: any;

    basicData: any;

    basicOptions: any;

    selectedTeam: string = 'UX Researchers';

    filteredTeamMembers: any = [];

    ngOnInit(): void {
        this.initChart();
        this.filteredTeamMembers = this.teamMembers.filter(
            (item) => item.team === this.selectedTeam
        );
    }

    browserOnly(f: () => void) {
        if (isPlatformBrowser(this.platformId)) {
            this.zone.runOutsideAngular(() => {
                f();
            });
        }
    }

    initChart() {
        this.basicData = {
            labels: ['January', 'February', 'March', 'April', 'May'],
            datasets: [
                {
                    label: 'Previous Month',
                    data: [22, 36, 11, 33, 2],
                    fill: false,
                    borderColor: '#E0E0E0',
                    tension: 0.5,
                },
                {
                    label: 'Current Month',
                    data: [22, 16, 31, 11, 38],
                    fill: false,
                    borderColor: '#6366F1',
                    tension: 0.5,
                },
            ],
        };
        this.basicOptions = this.getBasicOptions();
    }

    progressValue: number = 25;

    completeTask: number = 1;

    selectedProjectID: number = 1;

    projectList = [
        {
            id: 1,
            title: 'Ultima Sales',
            totalTasks: 50,
            completedTask: 25,
        },
        {
            id: 2,
            title: 'Ultima Landing',
            totalTasks: 50,
            completedTask: 25,
        },
        {
            id: 3,
            title: 'Ultima SaaS',
            totalTasks: 50,
            completedTask: 25,
        },
        {
            id: 4,
            title: 'Ultima SaaS',
            totalTasks: 50,
            completedTask: 25,
        },
        {
            id: 5,
            title: 'Ultima SaaS',
            totalTasks: 50,
            completedTask: 25,
        },
    ];

    teams: any = [
        {
            title: 'UX Researchers',
            avatar: [
                'assets/demo/images/avatar/circle/avatar-f-1.png',
                'assets/demo/images/avatar/circle/avatar-f-6.png',
                'assets/demo/images/avatar/circle/avatar-f-11.png',
                'assets/demo/images/avatar/circle/avatar-f-12.png',
            ],
            avatarText: '+4',
            badgeClass: 'bg-pink-500',
        },
        {
            title: 'UX Designers',
            avatar: ['assets/demo/images/avatar/circle/avatar-f-2.png'],
            badgeClass: 'bg-blue-500',
        },
        {
            title: 'UI Designers',
            avatar: [
                'assets/demo/images/avatar/circle/avatar-f-3.png',
                'assets/demo/images/avatar/circle/avatar-f-8.png',
            ],
            avatarText: '+1',
            badgeClass: 'bg-green-500',
        },
        {
            title: 'Front-End Developers',
            avatar: [
                'assets/demo/images/avatar/circle/avatar-f-4.png',
                'assets/demo/images/avatar/circle/avatar-f-9.png',
            ],
            badgeClass: 'bg-yellow-500',
        },
        {
            title: 'Back-End Developers',
            avatar: ['assets/demo/images/avatar/circle/avatar-f-10.png'],
            badgeClass: 'bg-purple-500',
        },
    ];

    dailyTasks: DailyTask[] = [
        {
            id: 1,
            checked: true,
            label: 'Prepare personas',
            description:
                'Create profiles of fictional users representing target audience for product or service.',
            avatar: 'assets/demo/images/avatar/circle/avatar-f-6.png',
            borderColor: 'border-pink-500',
        },
        {
            id: 2,
            checked: false,
            label: 'Prepare a user journey map',
            description:
                'Visual representation of steps a user takes to accomplish a goal within product or service.',
            avatar: 'assets/demo/images/avatar/circle/avatar-f-7.png',
            borderColor: 'border-purple-500',
        },
        {
            id: 3,
            checked: false,
            label: 'Prepare wireframes for onboarding screen',
            description:
                'Create low-fidelity mockups of onboarding screen. Include layout, hierarchy, functionality.',
            avatar: 'assets/demo/images/avatar/circle/avatar-f-8.png',
            borderColor: 'border-blue-500',
        },
        {
            id: 4,
            checked: false,
            label: 'Review benchmarks',
            description:
                'Conduct research on similar products or services to understand market standards and identify opportunities.',
            avatar: 'assets/demo/images/avatar/circle/avatar-f-9.png',
            borderColor: 'border-green-500',
        },
        {
            id: 3,
            checked: false,
            label: 'Let a plan with UI Team',
            description:
                'Collaborate with UI design team to create plan for visual design of product or service.',
            avatar: 'assets/demo/images/avatar/circle/avatar-f-10.png',
            borderColor: 'border-yellow-500',
        },
    ];

    teamMembers = [
        {
            avatar: 'assets/demo/images/avatar/circle/avatar-f-1.png',
            name: 'Theresa Webb',
            title: 'UX Researchers',
            taskCount: 79,
            doneCount: 15,
            sprintCount: 72,
            onProjectsCount: 33,
            team: 'UX Researchers',
        },
        {
            avatar: 'assets/demo/images/avatar/circle/avatar-f-2.png',
            name: 'Courtney Henry',
            title: 'President of Sales',
            taskCount: 22,
            doneCount: 11,
            sprintCount: 3,
            onProjectsCount: 12,
            team: 'UX Researchers',
        },
        {
            avatar: 'assets/demo/images/avatar/circle/avatar-f-3.png',
            name: 'Kathryn Murphy',
            title: 'Web Designer',
            taskCount: 21,
            doneCount: 33,
            sprintCount: 11,
            onProjectsCount: 44,
            team: 'UX Researchers',
        },
        {
            avatar: 'assets/demo/images/avatar/circle/avatar-f-4.png',
            name: 'Diana Ross',
            title: 'Project Manager',
            taskCount: 34,
            doneCount: 11,
            sprintCount: 45,
            onProjectsCount: 23,
            team: 'UX Researchers',
        },
        {
            avatar: 'assets/demo/images/avatar/circle/avatar-f-5.png',
            name: 'Emily Smith',
            title: 'Software Engineer',
            taskCount: 22,
            doneCount: 3,
            sprintCount: 12,
            onProjectsCount: 1,
            team: 'UX Researchers',
        },
        {
            avatar: 'assets/demo/images/avatar/circle/avatar-f-6.png',
            name: 'Olivia Johnson',
            title: 'Human Resources Manager',
            taskCount: 54,
            doneCount: 23,
            sprintCount: 29,
            onProjectsCount: 14,
            team: 'UX Researchers',
        },
        {
            avatar: 'assets/demo/images/avatar/circle/avatar-f-7.png',
            name: 'Sarah Williams',
            title: 'Marketing Specialist',
            taskCount: 46,
            doneCount: 33,
            sprintCount: 12,
            onProjectsCount: 14,
            team: 'UX Researchers',
        },
        {
            avatar: 'assets/demo/images/avatar/circle/avatar-f-8.png',
            name: 'Madison Davis',
            title: 'Graphic Designer',
            taskCount: 23,
            doneCount: 55,
            sprintCount: 31,
            onProjectsCount: 15,
            team: 'UX Researchers',
        },

        {
            avatar: 'assets/demo/images/avatar/circle/avatar-f-9.png',
            name: 'Abigail Rodriguez',
            title: 'Content Writer',
            taskCount: 79,
            doneCount: 15,
            sprintCount: 72,
            onProjectsCount: 33,
            team: 'UX Designers',
        },

        {
            avatar: 'assets/demo/images/avatar/circle/avatar-f-10.png',
            name: 'Elizabeth Taylor',
            title: 'Customer Support Representative',
            taskCount: 12,
            doneCount: 32,
            sprintCount: 14,
            onProjectsCount: 16,
            team: 'UX Designers',
        },

        {
            avatar: 'assets/demo/images/avatar/circle/avatar-f-11.png',
            name: 'Chloe Anderson',
            title: 'Financial Analyst',
            taskCount: 11,
            doneCount: 17,
            sprintCount: 12,
            onProjectsCount: 14,
            team: 'UI Designers',
        },

        {
            avatar: 'assets/demo/images/avatar/circle/avatar-f-12.png',
            name: 'Sophia Lee',
            title: 'Product Manager',
            taskCount: 79,
            doneCount: 15,
            sprintCount: 72,
            onProjectsCount: 33,
            team: 'UI Designer',
        },

        {
            avatar: 'assets/demo/images/avatar/circle/avatar-f-3.png',
            name: 'Aria Jackson',
            title: 'Product Manager',
            taskCount: 79,
            doneCount: 15,
            sprintCount: 72,
            onProjectsCount: 33,
            team: 'Front-End Developers',
        },

        {
            avatar: 'assets/demo/images/avatar/circle/avatar-f-7.png',
            name: 'Aria Jackson',
            title: 'Product Manager',
            taskCount: 79,
            doneCount: 15,
            sprintCount: 72,
            onProjectsCount: 33,
            team: 'Front-End Developers',
        },

        {
            avatar: 'assets/demo/images/avatar/circle/avatar-f-9.png',
            name: 'John Doe',
            title: 'Product Manager',
            taskCount: 79,
            doneCount: 15,
            sprintCount: 72,
            onProjectsCount: 33,
            team: 'Back-End Developers',
        },
    ];

    teamFilter(team: string) {
        this.selectedTeam = team;
        this.filteredTeamMembers = this.teamMembers.filter(
            (item) => item.team === team
        );
    }

    changeChecked() {
        this.completeTask = this.dailyTasks.filter(
            (task) => task.checked
        ).length;
    }

    getBasicOptions() {
        const textColor = getComputedStyle(document.body).getPropertyValue(
            '--text-color'
        );
        const surfaceLight = getComputedStyle(document.body).getPropertyValue(
            '--surface-100'
        );
        return {
            plugins: {
                legend: {
                    labels: {
                        color: textColor,
                        boxWidth: 12,
                        boxHeight: 4,
                    },
                    position: 'bottom',
                },
            },
            elements: { point: { radius: 0 } },
            scales: {
                x: {
                    ticks: {
                        color: textColor,
                    },
                    grid: {
                        color: surfaceLight,
                    },
                },
                y: {
                    ticks: {
                        color: textColor,
                        stepSize: 10,
                    },
                    grid: {
                        color: surfaceLight,
                    },
                },
            },
        };
    }

    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
}
