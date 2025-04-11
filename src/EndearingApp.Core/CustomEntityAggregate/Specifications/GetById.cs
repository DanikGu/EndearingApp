using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Ardalis.Specification;

namespace EndearingApp.Core.CustomEntityAggregate.Specifications;
public class GetById : Specification<CustomEntity>
{
    public GetById(Guid id)
    {
        Query.Where(x => x.Id == id).Include(x => x.Fields).Include(y => y.Relationships);
    }
}
