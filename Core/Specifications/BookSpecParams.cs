using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Core.Specifications
{
    public class BookSpecParams
    {
        private string? search;
        public string? Search
        {
          get => search;
          set => search = value.ToLower();
        }
    }
}