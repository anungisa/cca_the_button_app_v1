import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';

const heroItems = [
    {
        title: "Log Your Next Session",
        description: "Keep your streak alive and track your progress towards new milestones.",
        buttonText: "Log Session",
        image: "https://images.unsplash.com/photo-1559166631-ef2084400183?q=80&w=800&auto=format&fit=crop",
        gradient: "from-blue-600 to-indigo-700"
    },
    {
        title: "Weekly Challenge: 50 Sweeps",
        description: "Complete 50 sweeps in a single Smart Broom session to earn a badge.",
        buttonText: "Start Challenge",
        image: "https://images.unsplash.com/photo-1627993358399-52b3c2936a7e?q=80&w=800&auto=format&fit=crop",
        gradient: "from-purple-600 to-pink-700"
    },
    {
        title: "Support FTLOC Scholars",
        description: "Send kudos to our For The Love Of Curling athletes and earn XP.",
        buttonText: "Send Kudos",
        image: "https://images.unsplash.com/photo-1594736797933-d0401ba0bf61?q=80&w=800&auto=format&fit=crop",
        gradient: "from-brand-red to-amber-600"
    }
];

export default function YouthHeroTile() {
    return (
        <Carousel className="w-full h-full">
            <CarouselContent>
                {heroItems.map((item, index) => (
                    <CarouselItem key={index}>
                        <div className="p-1 h-full">
                            <Card className={`relative text-white overflow-hidden h-full flex flex-col justify-between bg-gradient-to-br ${item.gradient}`}>
                                <img src={item.image} className="absolute inset-0 w-full h-full object-cover opacity-20" alt="" />
                                <CardContent className="relative z-10 p-6 flex flex-col justify-between flex-grow">
                                    <div>
                                        <h3 className="text-2xl font-bold">{item.title}</h3>
                                        <p className="text-white/80 mt-2">{item.description}</p>
                                    </div>
                                    <Button variant="secondary" className="mt-4 self-start">
                                        {item.buttonText} <ArrowRight className="w-4 h-4 ml-2" />
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    </CarouselItem>
                ))}
            </CarouselContent>
            <CarouselPrevious className="left-2" />
            <CarouselNext className="right-2" />
        </Carousel>
    );
}