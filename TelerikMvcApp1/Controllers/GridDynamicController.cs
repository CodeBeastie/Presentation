using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;
using Kendo.Mvc.Extensions;
using Kendo.Mvc.UI;
using TelerikMvcApp1.Data;
using TelerikMvcApp1.Models;
using TelerikMvcApp1.ViewModels;

namespace TelerikMvcApp1.Controllers {
	public class GridDynamicController : Controller {






		public ActionResult GridD1() {
			GridDynamicViewModel vm = new GridDynamicViewModel();
			vm.DemoName = "Grid Dynamic Columns";
			vm.GridColumns = new List<MyColumnSettings> {
				new MyColumnSettings { Title="Animal Name", PropertyName="Name", Width=200, Editable=false, ColType = typeof(string)},
				new MyColumnSettings { Title="Animal Type", PropertyName="AnimalType", Width=50, Editable=true, ColType = typeof(string)}
			};
			
			return View("GridD1", vm);
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

	

	}
}