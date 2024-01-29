using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace API.Dtos
{
    public class BookToCreateDto
    {
        [Required]
        public string Name { get; set; }

        [Required]
        public decimal Rating { get; set; }

        [Required]
        public string Author { get; set; }

        [Required]
        public string Genre { get; set; }

        [Required]
        public bool IsBookAvailable { get; set; }

        [Required]
        public string Description { get; set; }

        [Required]
        public int LentByUserId { get; set; }

        public int? CurrentlyBorrowedByUserId { get; set; }
    }
}