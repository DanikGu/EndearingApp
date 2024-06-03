using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Ardalis.Specification;

namespace EndearingApp.Core.CustomEntityAggregate.Specifications;

public class GetReferencedEntities : Specification<CustomEntity>
{
    public GetReferencedEntities(string referencedTable)
    {
        Query.Where(x => x.Relationships.Any(y => y.ReferencedTableName == referencedTable));
    }
}
