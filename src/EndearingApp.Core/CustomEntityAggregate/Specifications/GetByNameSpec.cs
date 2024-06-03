using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Ardalis.Specification;

namespace EndearingApp.Core.CustomEntityAggregate.Specifications;

public class GetByNameSpec : Specification<CustomEntity>
{
    public GetByNameSpec(string name)
    {
        Query.Where(x => x.Name == name).Include(x => x.Fields).Include(y => y.Relationships);
    }
}
