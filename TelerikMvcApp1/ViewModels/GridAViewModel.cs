using System;
using System.Linq;

namespace TelerikMvcApp1.ViewModels {

	public class GridAViewModel {
		public string DemoName { get; set; }
		public IQueryable<AnimalViewModel> Animals { get; set; }
	}
}