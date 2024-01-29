using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Core.Entities
{
    public class Book : BaseEntity
    {
        
        [Required(ErrorMessage ="Please enter book name")]
        public string Name { get; set; }
        
        [Required(ErrorMessage ="Please enter rating")]
        public decimal Rating { get; set; }
        
        [Required(ErrorMessage ="Please enter author name")]
        public string Author { get; set; }
        
        [Required(ErrorMessage ="Please enter genre")]
        public string Genre { get; set; }
        
        [Required(ErrorMessage ="Please enter availability status")]
        public bool IsBookAvailable { get; set; } = true;
        
        [Required(ErrorMessage ="Please enter description")]
        public string Description { get; set; }
        
        [Required]
        [ForeignKey("LentByUser")]
        public int LentByUserId { get; set; }
        
        [ForeignKey("CurrentlyBorrowedByUser")]
        public int? CurrentlyBorrowedByUserId { get; set; }

        public User LentByUser {get; set;}

        public User CurrentlyBorrowedByUser {get; set;}

    }
}