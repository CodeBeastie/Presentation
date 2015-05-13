using System;
using System.Linq;

namespace TelerikMvcApp1.Models {
	public class Animal {
		public int Id { get; set; }
		public string AnimalType { get; set; }
		public string Name { get; set; }
		public bool InZoo { get; set; }
		public int Age { get; set; }
	}
}