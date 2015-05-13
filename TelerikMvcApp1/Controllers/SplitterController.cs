using System;
using System.Linq;
using System.Web.Mvc;

namespace TelerikMvcApp1.Controllers {
	public class SplitterController : Controller {

		public ActionResult Index() {
			return View();
		}

		public ActionResult SplitMVC() {
			return View("splitmvc");
		}

		public ActionResult SplitJS() {
			return View("splitjs");
		}

		public ActionResult SplitDataAttrib() {
			return View("splitdataattrib");
		}
	}
}