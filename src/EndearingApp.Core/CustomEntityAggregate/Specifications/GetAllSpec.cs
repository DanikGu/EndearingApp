using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Ardalis.Specification;

namespace EndearingApp.Core.CustomEntityAggregate.Specifications;

public class GetAllSpec : Specification<CustomEntity>
{
    public GetAllSpec()
    {
        Query.
            Include(x => x.Fields).
            ThenInclude(x => x.OptionSetDefinition).
            Include(y => y.Relationships);
    }
}
