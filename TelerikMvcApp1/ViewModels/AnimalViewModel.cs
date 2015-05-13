using System;
using System.ComponentModel.DataAnnotations;
using System.Linq;

namespace TelerikMvcApp1.ViewModels {
	public class AnimalViewModel {
		public int Id { get; set; }

		[StringLength(100, ErrorMessage = "The {0} must be at least {2} characters long.", MinimumLength = 3)]
		public string Name { get; set; }

		[Required]
		public string AnimalType { get; set; }
		
		[Display(Name = "In the Zoo?")]
		public bool InZoo { get; set; }
		
		public int Age { get; set; }
	}
}