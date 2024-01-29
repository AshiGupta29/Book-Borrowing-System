using System.Linq.Expressions;
using Core.Entities;
using Core.Specifications;

namespace Core.Interfaces
{
    public interface IGenericRepository<T> where T : BaseEntity
    {
        Task<T> GetByIdAsync(int id);
        Task<IReadOnlyList<T>> ListAllAsync();
        Task<T> GetEntityWithSpec(ISpecification<T> spec);
        Task<IReadOnlyList<T>> ListAsync(ISpecification<T> spec, Func<object, object> include);
        Task<IReadOnlyList<(int Id, string Name)>> ListIdAsync(ISpecification<T> spec, Expression<Func<T, (int Id, string Name)>> selector);
        Task<int> CountAsync(ISpecification<T> spec);
        void Add(T entity);
        void Update(T entity);
        void Delete(T entity);
        Task<IEnumerable<Book>> ListAsync(Func<object, object> include);
         Task<IReadOnlyList<T>> ListAsync(ISpecification<T> spec, params Expression<Func<T, object>>[] includes);
    }
}