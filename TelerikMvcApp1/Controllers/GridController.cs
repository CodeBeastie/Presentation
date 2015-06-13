using System;
using System.Linq;
using System.Web.Mvc;
using Kendo.Mvc.Extensions;
using Kendo.Mvc.UI;
using TelerikMvcApp1.Data;
using TelerikMvcApp1.Models;
using TelerikMvcApp1.ViewModels;

namespace TelerikMvcApp1.Controllers {
	public class GridController : Controller {

		#region Demo A
		public ActionResult GridA() {
			GridAViewModel vm = new GridAViewModel();
			vm.DemoName = "Grid Demo A";
			vm.Animals = Animals.Instance.ReadAnimals().Select(x=> new AnimalViewModel { Id=x.Id, AnimalType=x.AnimalType, Name=x.Name, InZoo=x.InZoo});
			return View("GridA",vm);
		}
		#endregion



		#region Demo B
		public ActionResult GridB() {
			GridAViewModel vm = new GridAViewModel();
			vm.DemoName = "Grid Demo B";
			
			return View("GridB", vm);
		}



		public ActionResult GridBRead([DataSourceRequest] DataSourceRequest request) {
			IQueryable<AnimalViewModel> animals = Animals.Instance.ReadAnimals().Select(x => new AnimalViewModel { Id = x.Id, AnimalType = x.AnimalType, Name = x.Name, InZoo = x.InZoo, Age = x.Age });
			return Json(animals.ToDataSourceResult(request));
		}

		[HttpPost]
		public ActionResult GridBCreate([DataSourceRequest] DataSourceRequest request, AnimalViewModel vm) {
			if (vm != null && ModelState.IsValid) {
				Animals.Instance.CreateAnimal(new Animal { Age = vm.Age, InZoo = vm.InZoo, AnimalType = vm.AnimalType, Name = vm.Name });
			}
			return Json(new[] { vm }.ToDataSourceResult(request, ModelState));
		}


		[HttpPost]
		public ActionResult GridBUpdate([DataSourceRequest] DataSourceRequest request, AnimalViewModel vm) {
			if (vm != null && ModelState.IsValid) {
				Animals.Instance.UpdateAnimal(new Animal { Id = vm.Id, Age = vm.Age, InZoo = vm.InZoo, AnimalType = vm.AnimalType, Name = vm.Name });
				bool error = false;
				if (error) {
					ModelState.AddModelError("Name", "There has been a problem on the server!");
				}
			}
			return Json(new[] { vm }.ToDataSourceResult(request, ModelState));
		}

		[HttpPost]
		public ActionResult GridBDestroy([DataSourceRequest] DataSourceRequest request, AnimalViewModel vm) {
			if (vm != null) {
				Animals.Instance.DeleteAnimal(new Animal { Id = vm.Id });
			}
			return Json(new[] { vm }.ToDataSourceResult(request, ModelState));
		}

		#endregion

	}
}