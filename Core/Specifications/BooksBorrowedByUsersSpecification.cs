using Core.Entities;

namespace Core.Specifications
{
    public class BooksBorrowedByUsersSpecification : BaseSpecification<Book>
    {
         public BooksBorrowedByUsersSpecification(int userId) : base(o => o.CurrentlyBorrowedByUserId == userId)
        {
             AddInclude(b => b.CurrentlyBorrowedByUser);
        }
    }
}