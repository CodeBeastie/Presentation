using System;
using System.Collections.Generic;
using System.Linq;
using TelerikMvcApp1.Models;

namespace TelerikMvcApp1.Data {
	public class Animals {
		private readonly List<Animal> _data;
		static private readonly Animals _instance = new Animals();

		static public Animals Instance {
			get {
				return _instance;
			}
		}

		public Animals(){
			_data = new List<Animal>() {
				new Animal { Id = 1, AnimalType = "Ant", Name = "Elizabeth", InZoo = false, Age = 15 },
				new Animal { Id = 2, AnimalType = "Ape", Name = "Neil", InZoo = false, Age = 13 },
				new Animal { Id = 3, AnimalType = "Badger", Name = "Leland", InZoo = false, Age = 6 },
				new Animal { Id = 4, AnimalType = "Bear", Name = "Lynn", InZoo = true, Age = 0 },
				new Animal { Id = 5, AnimalType = "Bee", Name = "Jeannie", InZoo = false, Age = 2 },
				new Animal { Id = 6, AnimalType = "Cat", Name = "Wendy", InZoo = false, Age = 1 },
				new Animal { Id = 7, AnimalType = "Chicken", Name = "Shannon", InZoo = false, Age = 2 },
				new Animal { Id = 8, AnimalType = "Crab", Name = "Olive", InZoo = false, Age = 16 },
				new Animal { Id = 9, AnimalType = "Crow", Name = "Troy", InZoo = false, Age = 18 },
				new Animal { Id = 10, AnimalType = "Deer", Name = "Ryan", InZoo = false, Age = 10 },
				new Animal { Id = 11, AnimalType = "Dog", Name = "Willis", InZoo = false, Age = 4 },
				new Animal { Id = 12, AnimalType = "Dolphin", Name = "Kerry", InZoo = false, Age = 15 },
				new Animal { Id = 13, AnimalType = "Duck", Name = "Marilyn", InZoo = false, Age = 8 },
				new Animal { Id = 14, AnimalType = "Eagle", Name = "Nancy", InZoo = false, Age = 6 },
				new Animal { Id = 15, AnimalType = "Elephant", Name = "Archie", InZoo = true, Age = 17 },
				new Animal { Id = 16, AnimalType = "Ferret", Name = "Rodolfo", InZoo = false, Age = 3 },
				new Animal { Id = 17, AnimalType = "Giraffe", Name = "Casey", InZoo = false, Age = 19 },
				new Animal { Id = 18, AnimalType = "Goat", Name = "Felix", InZoo = false, Age = 2 },
				new Animal { Id = 19, AnimalType = "Hamster", Name = "Amos", InZoo = true, Age = 19 },
				new Animal { Id = 20, AnimalType = "Hawk", Name = "Jorge", InZoo = false, Age = 15 },
				new Animal { Id = 21, AnimalType = "Horse", Name = "Cary", InZoo = false, Age = 1 },
				new Animal { Id = 22, AnimalType = "Kangaroo", Name = "Clark", InZoo = false, Age = 12 },
				new Animal { Id = 23, AnimalType = "Lemur", Name = "Paul", InZoo = false, Age = 1 },
				new Animal { Id = 24, AnimalType = "Mole", Name = "Alejandro", InZoo = false, Age = 10 },
				new Animal { Id = 25, AnimalType = "Monkey", Name = "Scott", InZoo = false, Age = 1 },
				new Animal { Id = 26, AnimalType = "Mouse", Name = "Joan", InZoo = false, Age = 12 },
				new Animal { Id = 27, AnimalType = "Newt", Name = "Grady", InZoo = false, Age = 16 },
				new Animal { Id = 28, AnimalType = "Octopus", Name = "Melba", InZoo = false, Age = 17 },
				new Animal { Id = 29, AnimalType = "Owl", Name = "Sheri", InZoo = true, Age = 7 },
				new Animal { Id = 30, AnimalType = "Parrot", Name = "Jackie", InZoo = false, Age = 3 },
				new Animal { Id = 31, AnimalType = "Rat", Name = "Janet", InZoo = false, Age = 8 },
				new Animal { Id = 32, AnimalType = "Sheep", Name = "Lynda", InZoo = false, Age = 4 },
				new Animal { Id = 33, AnimalType = "Snake", Name = "Connie", InZoo = false, Age = 8 },
				new Animal { Id = 34, AnimalType = "Spider", Name = "Darren", InZoo = false, Age = 16 },
				new Animal { Id = 35, AnimalType = "Squid", Name = "Doyle", InZoo = false, Age = 3 },
				new Animal { Id = 36, AnimalType = "Swan", Name = "Terry", InZoo = false, Age = 15 },
				new Animal { Id = 37, AnimalType = "Tiger", Name = "Ana", InZoo = false, Age = 5 },
				new Animal { Id = 38, AnimalType = "Toad", Name = "Francisco", InZoo = false, Age = 11 },
				new Animal { Id = 39, AnimalType = "Turkey", Name = "Samantha", InZoo = true, Age = 16 },
				new Animal { Id = 40, AnimalType = "Wolf", Name = "Hilda", InZoo = false, Age = 15 },
				new Animal { Id = 41, AnimalType = "Worm", Name = "Kerry", InZoo = false, Age = 2 },
				new Animal { Id = 42, AnimalType = "Alligator", Name = "Darin", InZoo = true, Age = 4 }
			};
		}


		public IQueryable<Animal> ReadAnimals() {
			return _data.AsQueryable();
		}

		public void CreateAnimal(Animal m) {
			int maxid = _data.Max(x => x.Id);
			m.Id = maxid+1;
			_data.Add(m);
		}

		public void UpdateAnimal(Animal m) {
			Animal a = _data.Where(x => x.Id == m.Id).SingleOrDefault();
			if (a != null) {
				a.AnimalType = m.AnimalType;
				a.Name = m.Name;
				a.Age = m.Age;
				a.InZoo = m.InZoo;
			}
		}

		public void DeleteAnimal(Animal m) {
			Animal a = _data.Where(x => x.Id == m.Id).SingleOrDefault();
			if (a != null) {
				_data.Remove(a);
			}
		}
	}
}

/*
* Generator:
new Animal { Id=YY1, AnimalType="ZZ1", Name="ZZ2",  InZoo=false, Age=XX2 },
 
Alligator	Darin
Ant	Elizabeth
Ape	Neil
Badger	Leland
Bear	Lynn
Bee	Jeannie
Cat	Wendy
Chicken	Shannon
Crab	Olive
Crow	Troy
Deer	Ryan
Dog	Willis
Dolphin	Kerry
Duck	Marilyn
Eagle	Nancy
Elephant	Archie
Ferret	Rodolfo
Giraffe	Casey
Goat	Felix
Hamster	Amos
Hawk	Jorge
Horse	Cary
Kangaroo	Clark
Lemur	Paul
Mole	Alejandro
Monkey	Scott
Mouse	Joan
Newt	Grady
Octopus	Melba
Owl	Sheri
Parrot	Jackie
Rat	Janet
Sheep	Lynda
Snake	Connie
Spider	Darren
Squid	Doyle
Swan	Terry
Tiger	Ana
Toad	Francisco
Turkey	Samantha
Wolf	Hilda
Worm	Kerry



*/