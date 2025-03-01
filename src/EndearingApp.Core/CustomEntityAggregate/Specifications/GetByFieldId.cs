using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Ardalis.Specification;

namespace EndearingApp.Core.CustomEntityAggregate.Specifications;
public class GetByFieldId: Specification<CustomEntity>
{
    public GetByFieldId(Guid fieldId) 
    {
        Query
            .Where(x => x.Fields.Any(f => f.Id == fieldId))
            .Include(x => x.Fields)
            .Include(y => y.Relationships);
    }

}
