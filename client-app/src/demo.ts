interface Duck {
    name: string,
    numLegs: number,
    makeSound (sound:string): void;
}

const duck1: Duck = {
    name : "huey",
    numLegs: 2,
    makeSound: (sound: string) => console.log(sound)  
}

const duck2: Duck = {
    name : "duey",
    numLegs: 2,
    makeSound: (sound: string) => console.log(sound)  
}

duck1.makeSound("Quack!");
duck2.makeSound( "GeeUp!");

export const ducks = [duck1, duck2];