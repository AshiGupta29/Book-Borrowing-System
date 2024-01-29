using Core.Entities;

namespace Core.Specifications
{
    public class BooksLentedByUsersSpecification : BaseSpecification<Book>
    {
         public BooksLentedByUsersSpecification(int userId) : base(o => o.LentByUserId == userId)
        {
             AddInclude(b => b.LentByUser);
        }

    }
}