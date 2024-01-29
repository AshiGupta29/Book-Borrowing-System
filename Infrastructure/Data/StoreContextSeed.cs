using System.Text.Json;
using Core.Entities;
using Microsoft.AspNetCore.Identity;

namespace Infrastructure.Data
{
    public class StoreContextSeed
    {
         public static async Task SeedAsync(StoreContext context,UserManager<User> userManager )
        {
            if (!context.Books.Any())
            {
                var booksData = File.ReadAllText("../Infrastructure/Data/SeedData/Books.json");
                var books = JsonSerializer.Deserialize<List<Book>>(booksData);
                context.Books.AddRange(books);
            }

            if (!userManager.Users.Any())
            {
                var users = new List<(string Firstname, string Lastname ,string UserName,string Email,string Password, int TokensAvailable)>
                {
                    ("Ashi","Gupta","ashigupta@gmail.com","ashigupta0529@gmail.com", "ashi@2000",1),
                    ("Puneet","Rekhi","puneet@gmail.com","puneet@gmail.com", "puneet@2000",4),
                    ("Yash","Agrawal","yash@gmail.com","yash@gmail.com", "yash@2000",1),
                    ("Pranav","Gupta","pranav@gmail.com","pranav@gmail.com", "pranav@2000",2)
                };

                foreach (var userData in users)
                {
                    var user = new User
                    {
                        Firstname = userData.Firstname,
                        Lastname = userData.Lastname,
                        UserName = userData.UserName,
                        Email = userData.Email,
                        TokensAvailable = userData.TokensAvailable
                    };

                   var result = await userManager.CreateAsync(user, userData.Password);
                    if (!result.Succeeded)
                    {
                        foreach (var error in result.Errors)
                        {
                            Console.WriteLine($"Error: {error.Description}");
                        }
                    }
                }
            }


            if (context.ChangeTracker.HasChanges()) await context.SaveChangesAsync();
        }
    }
}