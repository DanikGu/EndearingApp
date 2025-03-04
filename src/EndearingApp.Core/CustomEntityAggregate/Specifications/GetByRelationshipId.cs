using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Ardalis.Specification;

namespace EndearingApp.Core.CustomEntityAggregate.Specifications;
public class GetByRelationshipId : Specification<CustomEntity>
{
    public GetByRelationshipId(Guid relationshipId)
    {
        Query
            .Where(x => x.Relationships.Any(r => r.Id == relationshipId))
            .Include(x => x.Fields)
            .Include(y => y.Relationships);
    }
}
