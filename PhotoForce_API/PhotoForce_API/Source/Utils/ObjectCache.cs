using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace PhotoForce_API
{
    using System;

    /// <summary>
    /// ObjectCache is Class for keep the object one day
    /// </summary>
    /// <typeparam name="T">T is Generic type</typeparam>
    internal class ObjectCache<T>
    {
        /// <summary>
        /// <c>_expDate is login Date</c>
        /// </summary>
        private readonly DateTime _expDate;

        /// <summary>
        /// Initializes a new instance of the <see cref="ObjectCache{T}"/> class.
        /// </summary>
        /// <param name="item">The item is Generic Data Type</param>
        public ObjectCache(T item)
        {
            _expDate = DateTime.Now.AddDays(1);
            ObjectItem = item;
        }

        /// <summary>
        /// Initializes a new instance of the <see cref="ObjectCache{T}"/> class.
        /// </summary>
        public ObjectCache()
        {
            _expDate = DateTime.Now.AddDays(1);
        }

        /// <summary>
        /// Gets or sets ObjectItem
        /// </summary>
        public T ObjectItem { get; set; }

        /// <summary>
        /// Verify object expired or not
        /// </summary>
        /// <returns>returns true or false</returns>
        public bool IsExpired()
        {
            return DateTime.Now > _expDate;
        }
    }
}