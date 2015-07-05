using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;
using Kendo.Mvc.Extensions;
using Kendo.Mvc.UI;
using TelerikMvcApp1.ViewModels;

namespace TelerikMvcApp1.Controllers {
	public class HomeController : Controller {
		public ActionResult Index() {
			ViewBag.Message = "Welcome to ASP.NET MVC!";

			return View();
		}

		public ActionResult About() {
			ViewBag.Message = "Your app description page.";

			return View();
		}

		public ActionResult Contact() {
			ViewBag.Message = "Your contact page.";

			return View();
		}

		public ActionResult ShowReport() {
			return View();
		}



		[HttpPost]
		public ActionResult DemoSelections([DataSourceRequest]DataSourceRequest request) {
			List<DemoSelectionViewModel> vmlist = new List<DemoSelectionViewModel>() {
				new DemoSelectionViewModel { Name="Splitter JS", Action="SplitJS", Controller="Splitter"},
				new DemoSelectionViewModel { Name="Splitter MVC", Action="SplitMVC", Controller="Splitter"},
				new DemoSelectionViewModel { Name="Splitter Declarative", Action="SplitDataAttrib", Controller="Splitter"},
				new DemoSelectionViewModel { Name="Grid Demo A", Action="GridA", Controller="Grid"},
				new DemoSelectionViewModel { Name="Grid Demo B", Action="GridB", Controller="Grid"},
				new DemoSelectionViewModel { Name="Grid Demo Dynamic Columns", Action="GridD1", Controller="GridDynamic"},
				new DemoSelectionViewModel { Name="Show Report", Action="ShowReport", Controller="Home"},
			};
			return Json(vmlist.ToDataSourceResult(request));
		}


	}
}
