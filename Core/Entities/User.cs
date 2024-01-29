using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.AspNetCore.Identity;

namespace Core.Entities
{
    public class User : IdentityUser<int>
    {
        [Key]
        public int Id {get; set;}
        public string Firstname {get; set;}

        public string Lastname {get; set;}

        public int TokensAvailable {get; set;}

        [ForeignKey("CurrentlyBorrowedByUserId")]
        public ICollection<Book> BooksBorrowed {get; set;}

        [ForeignKey("LentByUserId")]
        public ICollection<Book> BooksLent {get; set;}
    }
}